import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import Post from '@/app/[lang]/views/post';
import type { Metadata } from 'next';

async function getPostBySlug(slug: string, locale: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        filters: { slug },
        locale,
        populate: {
            cover: { fields: ['url'] },
            authorsBio: { populate: '*' },
            category: { fields: ['name'] },
            blocks: { 
                populate: {
                    '__component': '*', 
                    'files': '*',
                    'file': '*',
                    'url': '*',
                    'body': '*',
                    'title': '*',
                    'author': '*',
                }
            },
        },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    console.log('porco dio')
    console.log(response)
    return response;
}

async function getMetaData(slug: string, locale: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        locale,
        filters: { slug },
        populate: { seo: { populate: '*' } },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    console.log('METADATA', response)
    return response.data;
}

export async function generateMetadata({ params }: { params: { slug: string, lang: string } }): Promise<Metadata> {
    const meta = await getMetaData(params.slug, params.lang);
    const metadata = meta[0].attributes.seo;

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription,
    };
}

export default async function PostRoute({ params }: { params: { slug: string, lang: string } }) {
    const { slug } = params;
    const data = await getPostBySlug(slug, params.lang);
    if (data.data.length === 0) return <h2>no post found</h2>;
    return <Post data={data.data[0]} />;
}

export async function generateStaticParams() {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const articleResponse = await fetchAPI(
        path,
        {
            populate: ['category'],
        },
        options
    );

    return articleResponse.data.map(
        (article: {
            attributes: {
                slug: string;
                category: {
                    slug: string;
                };
            };
        }) => ({ slug: article.attributes.slug, category: article.attributes.slug })
    );
}
