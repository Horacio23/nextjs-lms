import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId:string}}
) {
    try {
        const { userId } = auth() 
        const { chapterId, courseId } = params

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const ownCourse = db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if(!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId
            }
        })

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId
            }
        })

        if(!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 400 })
        }


        const unpublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json(unpublishedChapter)
    } catch (error) {
        console.log("[CHAPTER_PUBLISH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}