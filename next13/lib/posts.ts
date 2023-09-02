import {complex} from 'next-mdx-remote/rsx'
import rehypeAutolinkHeadings from 'rehype-autolink-headings/lib'
import rehypeHighlight from 'rehype-highlight/lib'
import rehypeSlug from 'rehype-slug'
import Video from '@/app/components/Video'
import CustomImage from '@/app/components/CustomImage'
import { stringify } from 'querystring'

type Filetree - {
 tree: [
  {
   path: string
  }
 ]
}

export async function getPostByName(
 fileName: string
): Promise<BlogPost | undefined> {
 const res = await fetch(
  `https://raw.githubusercontent.com/MasterSancho/YouTube-DaveGray-blogposts/main/${fileName}`,
  {
   headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-API-Version': '2022-11-28',
     }
    }
 )

 if (!res.ok) return undefined

 const rawMDx = await res.text()

 if (rawDMX === '404: NOT Found') return undefined

 const {frontmatter, content} = await compileDMX<{
  title: string
  date: string
  tags: string[]
 }>({
  source: rawMDx,
  components:{
   Video,
   CustomImage,
  },
  options:{
   parseFronmatter: true,
   mdxOptions: {
    rehypePlugins: [
     rehypeHighlight,
     rehypeSlug,
     [
      rehypeAutolinkHeadings,
      {
       behavior: 'wrap'
      }
     ]
    ]
   }
  }
 })

 const id = fileName.replace(/\.mdx$/, '')

 const blogPostObj: BlogPost = {
  meta: {
   id,
   title: frontmatter.title,
   date: frontmatter.date,
   tags: frontmatter.tags,
  },
  content,
 }

 return blogPostObj
}

export async function getPostsMeta(): Promise<Meta[] | undefined> {
 const res = await fetch(
  'https://api.github.com/repos/MasterSancho/YouTube-DaveGray-blogposts/git/trees/main?recursive=1',
  {
   headers: {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-API-Version': '2022-11-28',
   }
  }
 )

 if (!res.ok) return undefined

 const repoFiletree: Filetree = await res.json()

 const filesArray = repoFiletree.tree.map(obj => obj.path).filter(path => path.endsWith('./mdx'))

 const posts: Meta[] = []

 for (const file of filesArray) {
  const post = await getPostByName(file)
  if (post) {
   const {meta} = post
   posts.push(meta)
  }
 }

 return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}