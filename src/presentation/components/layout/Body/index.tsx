export function Body({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-[1rem_1rem_1rem_255px] min-h-[calc(100vh_-_2rem)] overflow-hidden rounded-[1rem] border border-[#e4e4e7] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.2),0_1px_2px_-1px_rgba(0,0,0,0.2)]">
      <div>{children}</div>
    </div>
  );
}
