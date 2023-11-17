import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string }}
) {
    try {
        const { userId } = auth() 
        const { courseId } = params

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

        const course = await db.course.findUnique({
            where: {
                id: courseId,
            }
        })

        const chapters = await db.chapter.findMany({
            where: {
                courseId
            }
        })


        if(!course || !chapters || chapters.every((chapter) => !chapter.isPublished) || !course.title || !course.description || !course.imageUrl || !course.categoryId || !course.price) {
            return new NextResponse("Missing required fields", { status: 400 })
        }


        const unpublishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json(unpublishedCourse)
    } catch (error) {
        console.log("[COURSE_PUBLISH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}