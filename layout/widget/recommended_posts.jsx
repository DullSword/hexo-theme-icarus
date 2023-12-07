/**
 * recommended posts widget JSX component.
 * @module view/widget/recommended_posts
 */
const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const ArticleMedia = require('hexo-component-inferno/lib/view/common/article_media');

/**
 * recommended posts widget JSX component.
 *
 * @example
 * <RecommendedPosts
 *     title="Widget title"
 *     posts={[
 *         {
 *             url: '/url/to/post',
 *             title: 'Post title',
 *             date: '******',
 *             dateXml: '******',
 *             thumbnail: '/path/to/thumbnail',
 *             categories: [{ name: 'Category name', url: '/path/to/category' }]
 *         }
 *     ]} />
 */
class RecommendedPosts extends Component {
    render() {
        const { title, posts } = this.props;

        return (
            <div class="card widget" data-type="recommended-posts">
                <div class="card-content">
                    <h3 class="menu-label">{title}</h3>
                    {posts.map((post) => {
                        return (
                            <ArticleMedia
                                thumbnail={post.thumbnail}
                                url={post.url}
                                title={post.title}
                                date={post.date}
                                dateXml={post.dateXml}
                                categories={post.categories}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

/**
 * Cacheable recommended posts widget JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <RecommendedPosts.Cacheable
 *     site={{ posts: {...} }}
 *     helper={{
 *         url_for: function() {...},
 *         __: function() {...},
 *         date_xml: function() {...},
 *         date: function() {...}
 *     }}
 *     limit={5} />
 */
RecommendedPosts.Cacheable = cacheComponent(RecommendedPosts, 'widget.recommendedposts', (props) => {
    const { site, helper, limit = 5 } = props;
    const { url_for, __, date_xml, date } = helper;
    if (!site.posts.length) {
        return null;
    }
    const posts = site.posts
        .sort('recommend', -1)
        .limit(limit)
        .map((post) => ({
            url: url_for(post.link || post.path),
            title: post.title,
            date: date(post.date),
            dateXml: date_xml(post.date),
            thumbnail: post.thumbnail ? url_for(post.thumbnail) : null,
            categories: post.categories.map((category) => ({
                name: category.name,
                url: url_for(category.path),
            })),
        }));
    return {
        posts,
        title: __('widget.recommended'),
    };
});

module.exports = RecommendedPosts;