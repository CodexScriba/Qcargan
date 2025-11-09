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
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Remove id from update data if present
    const { id: _, ...updateData } = body;

    // Update the record
    await db
      .update(tableSchema)
      .set(updateData)
      .where(eq(tableSchema.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating data:", error);
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
