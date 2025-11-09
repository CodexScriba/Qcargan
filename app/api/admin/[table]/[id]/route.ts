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

// Map table names to their primary key field
const primaryKeyMap: Record<string, string> = {
  banks: "id",
  vehicles: "id",
  organizations: "id",
  vehicle_pricing: "id",
  vehicle_specifications: "vehicleId",
  vehicle_images: "id",
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

    // Get the primary key field for this table
    const primaryKeyField = primaryKeyMap[table] || "id";

    // Remove primary key from update data
    const { id: _, vehicleId: __, ...updateData } = body;

    // Update the record using the correct primary key field
    await db
      .update(tableSchema)
      .set(updateData)
      .where(eq(tableSchema[primaryKeyField], id));

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

    // Get the primary key field for this table
    const primaryKeyField = primaryKeyMap[table] || "id";

    await db.delete(tableSchema).where(eq(tableSchema[primaryKeyField], id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
