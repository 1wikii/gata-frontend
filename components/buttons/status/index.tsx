import { Badge } from "@/components/ui/badge";

export function Green({ text }: { text: string }) {
  return <Badge className="bg-green-100 text-green-700">{text}</Badge>;
}

export function Orange({ text }: { text: string }) {
  return <Badge className="bg-orange-100 text-orange-700">{text}</Badge>;
}

export function Red({ text }: { text: string }) {
  return <Badge className="bg-red-100 text-red-700">{text}</Badge>;
}

export function BlueLight({ text }: { text: string }) {
  return <Badge className="bg-blue-50 text-blue-400">{text}</Badge>;
}

export function BlueMedium({ text }: { text: string }) {
  return <Badge className="bg-blue-100 text-blue-500">{text}</Badge>;
}

export function BlueDark({ text }: { text: string }) {
  return <Badge className="bg-blue-300 text-blue-700">{text}</Badge>;
}

export function PurpleLight({ text }: { text: string }) {
  return <Badge className="bg-purple-100 text-purple-600">{text}</Badge>;
}

export function PurpleMedium({ text }: { text: string }) {
  return <Badge className="bg-purple-300 text-purple-600">{text}</Badge>;
}
