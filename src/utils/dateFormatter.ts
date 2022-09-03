import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export default function dateFormat(date: string): string {
  const dateFormated = format(new Date(date), 'dd-MMM-yyyy', { locale: ptBR })
    .replace(/-/g, ' ')
    .replace(/(?:^|\s)/g, a => {
      return a.toUpperCase();
    });
  return dateFormated;
}
