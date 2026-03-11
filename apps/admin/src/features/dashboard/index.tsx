import { SignOutDialog } from "@zero-heads-lab/auth/components/sign-out-dialog";
import { useState } from "react";
import Welcome from "@/components/welcome";
import { Header } from "@/layout/header";
import MainContent from "@/layout/main-content";

const Dashboard = () => {
    const [open, setOpen] = useState(false);

    return (
        <MainContent>
            <Header>Test</Header>
            <div className="flex flex-col items-center">
                <Welcome />

                <SignOutDialog onOpenChange={setOpen} open={open} />
            </div>
        </MainContent>
    );
};

export default Dashboard;
