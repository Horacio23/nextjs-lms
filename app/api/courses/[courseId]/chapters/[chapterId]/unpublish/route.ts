
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

        if(!chapter) {
            return new NextResponse("Not found", { status: 404})
        }

        const unpublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
            },
            data: {
                isPublished: false
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            }
        })

        if(!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                    userId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(unpublishedChapter)
    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}