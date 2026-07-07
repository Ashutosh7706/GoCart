import StoreLayout from "@/components/store/StoreLayout";
import { getCurrentStore } from "@/lib/auth";

export const metadata = {
    title: "GoCart. - Store Dashboard",
    description: "GoCart. - Store Dashboard",
};

export default async function RootAdminLayout({ children }) {

    const store = await getCurrentStore();
    if(!store){
        redirect("/");

    }



    return (
        
            <StoreLayout>
                {children}
            </StoreLayout>
        
    );
}
