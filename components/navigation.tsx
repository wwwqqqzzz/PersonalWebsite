"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { MenuIcon } from "lucide-react"
import { useTheme } from "next-themes"

interface NavigationProps {
    menuOpen: boolean
    setMenuOpen: (open: boolean) => void
    activeSection: string
    setActiveSection: (section: string) => void
}

export default function Navigation({ menuOpen, setMenuOpen, activeSection, setActiveSection }: NavigationProps) {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link href="/" className="text-2xl font-bold">
                        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                    </Link>
                    <button
                        className="md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"    
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <div className="hidden md:flex space-x-4">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <Link href="/about" className="hover:text-primary">About</Link>
                        <Link href="/projects" className="hover:text-primary">Projects</Link>
                        <Link href="/skills" className="hover:text-primary">Skills</Link>
                        <Link href="/blog" className="hover:text-primary">Blog</Link>
                        <Link href="/contact" className="hover:text-primary">Contact</Link>
                    </div>
                </div>
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center z-40 bg-background/95 backdrop-blur-sm transition-all duration-300",
                    menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-4 text-2xl"
                    >
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <Link href="/about" className="hover:text-primary">About</Link>
                        <Link href="/projects" className="hover:text-primary">Projects</Link>
                        <Link href="/skills" className="hover:text-primary">Skills</Link>
                        <Link href="/blog" className="hover:text-primary">Blog</Link>
                        <Link href="/contact" className="hover:text-primary">Contact</Link>
                    </motion.div>
                </div>
            </div>
        </nav>
    )
}


