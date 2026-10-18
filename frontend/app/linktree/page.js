import Linktree from '@/components/Linktree/Linktree';
import linktree from '@/data/linktree';

export const metadata = {
  title: `${linktree.title} | Vihaan X`,
  description: linktree.description,
};

export default function LinktreePage() {
  return <Linktree linktree={linktree} />;
}
