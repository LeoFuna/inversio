import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function UpgradeProCard() {
  return (
    <Card className="mb-8 max-w-64">
      <CardHeader className="pb-4">
        <CardTitle>Seja PRO</CardTitle>
        <CardDescription>
          Aproveite a ferramenta sem limitações!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/trades">
          <Button className="w-full" size="sm">
            Ser PRO
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
