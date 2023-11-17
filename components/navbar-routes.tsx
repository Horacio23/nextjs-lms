"use client"

import { UserButton, useAuth } from "@clerk/nextjs"
import {usePathname, useRouter} from 'next/navigation'
import  Link from 'next/link'
import { Button } from "./ui/button"
import { LogOut } from 'lucide-react'
import { SearchInput } from "./search-input"
import { isTeacher } from "@/lib/teacher"

export const NavbarRoutes = () => {
    const pathname = usePathname()
    const { userId } = useAuth()

    const isTeacherPage = pathname?.startsWith("/teacher")
    const isCoursePage = pathname?.includes("/courses")
    const isSearchPage = pathname === "/search"

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isCoursePage ? (
                    <Link href="/">
                        <Button size="sm" variant="ghost">
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                ) : isTeacher(userId) ? (
                    <Link href="/teacher/courses" >
                        <Button size="sm" variant="ghost">
                            Teacher Mode
                        </Button>
                    </Link>
                ) : null}
                <UserButton afterSignOutUrl="/"/>
            </div>
        </>
    )
}