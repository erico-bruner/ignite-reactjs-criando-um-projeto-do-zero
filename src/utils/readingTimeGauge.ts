import { RichText } from 'prismic-dom';

interface Content {
  heading: string;
  body: {
    text: string;
  }[];
}

type ContentProps = Content[];

export default function readingTimeGauge(content: ContentProps): string {
  let totalWords = 0;

  content.map(e => {
    const words = [];
    if (e.heading) {
      words.push(...e.heading.split(' '));
    }
    if (e.body) {
      words.push(...RichText.asText(e.body).split(' '));
    }
    totalWords += words.length;
    return null;
  });

  const readingTime = Math.floor(totalWords / 200) + 1;

  return `${readingTime} min`;
}
