import fs from 'fs'
import path from 'path'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import matter from 'gray-matter'
import { BLOG_PATH, blogFilePaths } from '../../utils/mdxUtils'
import { Image } from '../../components/Image'

const components = { Image }

const Blog = ({ source, frontMatter }) => {
	const content = hydrate(source, { components })
	return (
		<div>
			<h1>{frontMatter.title}</h1>
			{content}
		</div>
	)
}

export async function getStaticPaths() {
	const paths = blogFilePaths.map((path) => {
		const split = path.split('/')
		const slug = split[split.length - 2]
		return {
			params: {
				slug,
			},
		}
	})

	return {
		paths,
		fallback: false,
	}
}

export const getStaticProps = async ({ params }) => {
	const { slug } = params
	const blogFilePath = path.join(BLOG_PATH, `/blog/${slug}/index.mdx`)

	const source = fs.readFileSync(blogFilePath)
	const { content, data } = matter(source)

	if (!blogFilePath) {
		console.warn('No MDX file found for slug')
	}

	const mdx = await renderToString(content, {}, null, data)

	return {
		props: {
			source: mdx,
			frontMatter: data,
		},
	}
}

export default Blog
