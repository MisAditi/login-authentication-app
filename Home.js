import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    const usenavigate = useNavigate();
    const [customerlist, listupdate] = useState(null);

    useEffect(() => {

    }, []);

    return (
        <div>

            <h1 className="text-center">Welcome to Dashboard</h1>
            <p className="text-center"> View customer list under Customer link</p>
        </div>
    );
}

export default Home;