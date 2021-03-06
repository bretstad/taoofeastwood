const markdownIt = require('markdown-it')({
  html: true,
  breaks: false,
  linkify: true,
  typographer: true,
});

const formatDate = (date, format) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const m0 = date.getMonth();
  const mm = `${m0 + 1}`.padStart(2, '0');
  const MM = months[m0];
  const M = MM.slice(0, 3);
  const d = date.getDate();
  const dd = `${d}`.padStart(2, '0');
  const D = days[date.getDay()];
  const yyyy = date.getFullYear();

  const formats = {
    day: `${D}`,
    date: `${d}`,
    month: `${mm}`,
    'month-name': `${MM}`,
    year: `${yyyy}`,
    numeric: `${mm}/${dd}/${yyyy}`,
    url: `${yyyy}/${mm}/${dd}`,
    short: `${M} ${d}, ${yyyy}`,
    long: `${MM} ${d}, ${yyyy}`,
  };

  return formats[format];
};

const getDate = (format = null, date = null) => {
  const now = date ? new Date(date) : new Date();
  return format ? formatDate(now, format) : now;
};

module.exports = eleventyConfig => {
  // pass-through
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy('CNAME');

  // layouts
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('chapter', 'layouts/chapter.njk');

  // collections
  eleventyConfig.addCollection('chapters', collection => {
    return collection
      .getAll()
      .filter(item => {
        return 'chapter' in item.data;
      })
      .sort((a, b) => {
        return a.data.chapter - b.data.chapter;
      });
  });

  // filters
  eleventyConfig.addFilter('typeOf', val => {
    return typeof val;
  });

  eleventyConfig.addFilter('formatDate', (date, format = 'short') => {
    return formatDate(date, format);
  });

  eleventyConfig.addFilter('getDate', (date = null, format = 'short') => {
    return getDate(format, date);
  });

  eleventyConfig.addFilter('getChapter', (chapters, chapter) => {
    return chapters.filter(item => {
      return chapter === item.data.chapter;
    });
  });

  eleventyConfig.addFilter('md', (content, inline = false) => {
    return inline
      ? markdownIt.renderInline(content)
      : markdownIt.render(content);
  });

  // shortcodes
  eleventyConfig.addShortcode('getDate', (format = null) => {
    return getDate(format);
  });

  eleventyConfig.addPairedShortcode('markdown', (content, inline = null) => {
    return inline
      ? markdownIt.renderInline(content)
      : markdownIt.render(content);
  });

  /* Markdown */
  eleventyConfig.setLibrary('md', markdownIt);

  return {
    markdownTemplateEngine: 'njk',
    dir: { output: 'docs' },
  };
};
