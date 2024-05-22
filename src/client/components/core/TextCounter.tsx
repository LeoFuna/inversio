export default function TextCounter({
  text,
  textLimit,
}: {
  text: string;
  textLimit?: number;
}) {
  return (
    <p className="text-xs text-primary opacity-75">
      {text.length} {textLimit ? `/ ${textLimit}` : ''}
    </p>
  );
}
