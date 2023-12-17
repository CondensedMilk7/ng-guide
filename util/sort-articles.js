const { readFileSync } = require("fs");

function filterArticles(collectionsApi) {
  const articles = collectionsApi.getFilteredByTag("articles");
  const summary = parseSummary(
    readFileSync("src/includes/partials/SUMMARY.md", "utf-8")
  );
  const sorted = sortArticlesBySummary(articles, summary);
  return sorted;
}

function parseSummary(markdown) {
  return markdown
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => ({
      title: line.match(/\[(.*?)\]/i)[1],
      url: line.match(/\((.*?)\)/i)[1],
    }));
}

function sortArticlesBySummary(articles, summary) {
  const result = [];
  summary.forEach((sum) => {
    const article = articles.find((article) => {
      const articlePath = article.outputPath.replace("public/", "/");
      return sum.url === articlePath;
    });
    if (article && !article.outputPath.endsWith("contributors.html")) {
      result.push(article);
    }
  });
  return result;
}

module.exports = filterArticles;
