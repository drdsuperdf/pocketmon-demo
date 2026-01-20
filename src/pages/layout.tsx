import Toaster from "./components/Toaster";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
