import getDetaFromToken from "@/helper/getDetaFromToken";
import Chat from "@/models/chat.Model";
import { dbconnect } from "@/utils/mongo";

export async function GET(req) {
  await dbconnect();
  const myData = getDetaFromToken();

  try {
    const chats = await Chat.find({ chatids: { $in: [myData.id] } })
      .sort({ updatedAt: -1 })
      .exec();

    return Response.json({
      data: chats,
      message: "success",
      statusCode: 200,
    });
  } catch (error) {
    return Response.json({ message: error?.message }, { status: 498 });
  }
}
