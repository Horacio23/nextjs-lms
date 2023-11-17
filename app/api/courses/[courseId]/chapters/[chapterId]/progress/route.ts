import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PUT(
    req: Request,
    { params }: { params: { chapterId: string }}
){
    try {
        const { userId } = auth()
        const { isCompleted } = await req.json()
        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        let progress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted
            }
        })

        return NextResponse.json(progress)
    } catch (error) {
        console.log("[PROGRESS_UPDATE]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}