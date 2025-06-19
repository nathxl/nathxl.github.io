module.exports = function (eleventyConfig) {
    // eleventyConfig.addPassthroughCopy("**/*.js");
    // eleventyConfig.addPassthroughCopy("**/*.css");
    // eleventyConfig.addPassthroughCopy("**/*.svg");
    // eleventyConfig.addPassthroughCopy("**/*.pdf");
    eleventyConfig.addPassthroughCopy("**/*.*");

    eleventyConfig.addWatchTarget("./src/");
    
    return {
        dir: {
            input: "src",
            layouts: "_includes",
        },
    };
};   