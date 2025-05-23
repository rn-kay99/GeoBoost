const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // ⬅️ Passthrough Copy
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/*.ico");
  eleventyConfig.addPassthroughCopy({ "src/_data/blog_posts.json": "_data/blog_posts.json" });

  // ⬅️ Custom Filter
  eleventyConfig.addFilter("date", (value, format = "yyyy") => {
    return DateTime.fromJSDate(value).toFormat(format);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "includes",
      layouts: "layouts"
    },
    htmlTemplateEngine: "njk"
  };
};