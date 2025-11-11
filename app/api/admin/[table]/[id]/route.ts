import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  banks,
  vehicles,
  organizations,
  vehiclePricing,
  vehicleSpecifications,
  vehicleImages,
} from "@/lib/db/schema";

// Map table names to schema objects
const tableMap: Record<string, any> = {
  banks,
  vehicles,
  organizations,
  vehicle_pricing: vehiclePricing,
  vehicle_specifications: vehicleSpecifications,
  vehicle_images: vehicleImages,
};

// UPDATE a record
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  try {
    const { table, id } = await params;
    const tableSchema = tableMap[table];

    if (!tableSchema) {
      console.error("[admin][PUT] Unknown table", { table, id });
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    const rawBody = await request.text();
    let body: any;
    try {
      body = rawBody ? JSON.parse(rawBody) : {};
    } catch (e) {
      console.error("[admin][PUT] Invalid JSON body", {
        table,
        id,
        rawBody,
        error: e,
      });
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { id: _omitId, ...updateData } = body;

    // Basic guard: do not run empty update
    if (!updateData || Object.keys(updateData).length === 0) {
      console.warn("[admin][PUT] Empty update payload", {
        table,
        id,
      });
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    console.log("[admin][PUT] Updating record", {
      table,
      id,
      updateKeys: Object.keys(updateData),
    });

    // Normalize special fields (dates) to avoid `.toISOString` errors inside drivers/adapters
    const normalizedUpdate: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(updateData)) {
      if (value === null || value === undefined) {
        normalizedUpdate[key] = value;
        continue;
      }

      // If column looks like a timestamp, coerce from string to Date
      if (
        (key.toLowerCase().includes("createdat") ||
          key.toLowerCase().includes("updatedat") ||
          key.toLowerCase().endsWith("at")) &&
        typeof value === "string"
      ) {
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
          normalizedUpdate[key] = parsed;
          continue;
        }
      }

      normalizedUpdate[key] = value;
    }

    const result = await db
      .update(tableSchema)
      .set(normalizedUpdate)
      .where(eq(tableSchema.id, id))
      .returning();

    if (!result || result.length === 0) {
      console.warn("[admin][PUT] No record updated", { table, id });
      return NextResponse.json(
        { error: "Record not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("[admin][PUT] Error updating data:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

// DELETE a record
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  try {
    const { table, id } = await params;
    const tableSchema = tableMap[table];

    if (!tableSchema) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    await db.delete(tableSchema).where(eq(tableSchema.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
