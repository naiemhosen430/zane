import getDetaFromToken from "@/helper/getDetaFromToken";
import User from "@/models/userModel";

const { dbconnect } = require("@/utils/mongo");

export async function GET() {
  await dbconnect();
  try {
    const data = getDetaFromToken();
    const result = await User.findOne({ email: data.email }).exec();
    return Response.json({
      statusCode: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
}
