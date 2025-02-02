import "@/styles/globals.css";
import Layout from "@/components/layout";
import { SessionProvider } from "next-auth/react";

export default function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
        </Layout>
        
    );
}
