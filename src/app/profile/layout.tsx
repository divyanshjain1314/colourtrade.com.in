export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-700 custom-bg">
            {children}
        </div>
    );
}