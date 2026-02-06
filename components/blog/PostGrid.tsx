'use client'

import { motion } from 'framer-motion'
import { PostCard } from './PostCard'
import type { Post } from '@/lib/blog-mock'

interface PostGridProps {
  posts: Post[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export function PostGrid({ posts }: PostGridProps) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post) => (
        <motion.li key={post.id} variants={item} className="group">
          <PostCard post={post} />
        </motion.li>
      ))}
    </motion.ul>
  )
}
