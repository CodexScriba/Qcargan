import { NextResponse } from "next/server";
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

// GET all records from a table
export async function GET(
  request: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table } = await params;
    const tableSchema = tableMap[table];

    if (!tableSchema) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    const data = await db.select().from(tableSchema);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
