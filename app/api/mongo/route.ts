import MongoService from "@lib/services/MongoService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ success: false, message: "MONGODB_URI is not defined" }, { status: 500 });
  }
  MongoService.setDatabase("tuanhuydev-dev");
  const database = MongoService.getDatabase();

  const movies = await database.collection("tasks").find().limit(10).toArray();
  return NextResponse.json({ success: true, message: "Connected to MongoDB", data: movies });
}
