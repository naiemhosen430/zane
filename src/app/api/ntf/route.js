import getDetaFromToken from "@/helper/getDetaFromToken";
import Ntf from "@/models/ntf.model";
import { dbconnect } from "@/utils/mongo";

export async function POST(NextRequest) {
    dbconnect();
    try {
      const data = await NextRequest.json();
  
      const myInfo = getDetaFromToken();
  
      const newNyf = Ntf(data);
  
      await newNyf.save();
  
      return Response.json({
        statusCode: 200,
        data: newNyf,
        message: "Ntf Added",
      });
    } catch (error) {
      return Response.json({
        statusCode: 498,
        message: "Server error",
      });
    }
  }

export async function GET() {
  dbconnect();
  try {

      const myInfo = getDetaFromToken();

      const allNyf = await Ntf.find({ownerid:myInfo?.id});

      return Response.json({
      statusCode: 200,
      data: allNyf?.reverse(),
      message: "Successfully",
      });
  } catch (error) {
      return Response.json({
      statusCode: 498,
      message: error.message,
      });
  }
}