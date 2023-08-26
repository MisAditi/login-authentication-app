import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './Customer.css';

const Customer = () => {
    const [custlist, custupdate] = useState([]);
    const [haveedit, editchange] = useState(false);
    const [haveview, viewchange] = useState(false);
    const [haveadd, addchange] = useState(false);
    const [haveremove, removechange] = useState(false);
    const [sortedField, setSortedField] = useState(null);
    const [sortDirection, setSortDirection] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // New state for search term

    const navigate = useNavigate();

    const handleSort = (field) => {
        if (field === sortedField) {
            setSortDirection(-sortDirection);
        } else {
            setSortedField(field);
            setSortDirection(1);
        }
    };
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    const sortData = (a, b) => {
        const aValue = a[sortedField];
        const bValue = b[sortedField];

        if (aValue === bValue) {
            return 0;
        }

        if (aValue === undefined || aValue === null) {
            return sortDirection;
        }

        if (bValue === undefined || bValue === null) {
            return -sortDirection;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * sortDirection;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return (aValue - bValue) * sortDirection;
        }

        return aValue.toString().localeCompare(bValue.toString()) * sortDirection;
    };
    const filteredData = custlist.filter((row) =>
        Object.values(row)
            .map((value) => value.toString().toLowerCase())
            .some((value) => value.includes(searchTerm.toLowerCase()))
    );
    const sortedData = [...filteredData].sort(sortData);


    useEffect(() => {
        GetUserAccess();
        loadcustomer();

    }, []);

    const loadcustomer = () => {
        fetch("http://localhost:8000/customer").then(res => {
            console.log('customer', res);

            if (!res.ok) {
                return false
            }
            return res.json();
        }).then(res => {
            custupdate(res);
            console.log('custlist', custlist)
        });
    }

    const GetUserAccess = () => {
        const userrole = sessionStorage.getItem('userrole') != null ? sessionStorage.getItem('userrole').toString() : '';

        console.log('userrole', userrole);
        fetch("http://localhost:8000/roleaccess?role=" + userrole + "&menu=customer").then(res => {
            console.log('response-role', res);

            if (!res.ok) {
                navigate('/');
                toast.warning('You are not authorized to access');
                return false;
            }
            return res.json();
        }).then(res => {
            console.log(res);
            if (res.length > 0) {
                viewchange(true);
                let userobj = res[0];
                editchange(userobj.haveedit);
                addchange(userobj.haveadd);
                removechange(userobj.havedelete);
            } else {
                navigate('/');
                toast.warning('You are not authorized to access');

            }
        })
    }

    const handleadd = () => {
        if (haveadd) {
            toast.success('added')
        } else {
            toast.warning('You are not having access for add');
        }
    }
    const handleedit = () => {
        if (haveedit) {
            toast.success('edited')
        }
        else {
            toast.warning('You are not having access for Edit');
        }
    }

    const handleremove = () => {
        if (haveremove) {
            toast.success('removed')
        } else {
            toast.warning('You are not having access for remove');
        }
    }


    return (
        <div >

            <div >
                <input
                    type="text"
                    placeholder="Search from Employee List..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <div >
                    <span>Employee List</span>
                </div>
                <div className="addBtn">
                    {haveadd && haveedit && haveremove ? (
                        <>
                            <button onClick={handleadd} className="btn btn-success">Add</button>
                        </>
                    ) : ''}
                     </div>
                    <br></br>
                    <table className="sortable-table" >
                        <thead>
                            <tr>
                                <th className={`sortable-header ${sortedField === 'code' ? 'sorted' : ''} ${sortDirection === 1 ? 'asc' : 'desc'}`} onClick={() => handleSort("code")}>Code </th>
                                <th className={`sortable-header ${sortedField === 'name' ? 'sorted' : ''} ${sortDirection === 1 ? 'asc' : 'desc'}`} onClick={() => handleSort("name")}>Name</th>
                                <th className={`sortable-header ${sortedField === 'email' ? 'sorted' : ''} ${sortDirection === 1 ? 'asc' : 'desc'}`} onClick={() => handleSort("email")}>Email </th>
                                <th className={`sortable-header ${sortedField === 'age' ? 'sorted' : ''} ${sortDirection === 1 ? 'asc' : 'desc'}`} onClick={() => handleSort("age")}>Age</th>
                                <th className={`sortable-header ${sortedField === 'designation' ? 'sorted' : ''} ${sortDirection === 1 ? 'asc' : 'desc'}`} onClick={() => handleSort("designation")}>Designation</th>
                                <th className={`sortable-header ${sortedField === 'experienceode' ? 'sorted' : ''} ${sortDirection === 1 ? 'asc' : 'desc'}`} onClick={() => handleSort("experienceode")}>Experience(Yrs)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData &&
                                sortedData.map((item, index) => (
                                    <tr key={item.code}>
                                       
                                        <td>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.age}</td>
                                        <td>{item.designation}</td>
                                        <td>{item.experience}</td>
                                        <td>
                                            {haveadd && haveedit && haveremove ? (
                                                <>
                                                    <button onClick={handleedit} className="btn btn-primary">
                                                        Edit
                                                    </button>{" "}
                                                    |
                                                    <button onClick={handleremove} className="btn btn-danger">
                                                        Remove
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={viewchange} className="btn btn-danger">
                                                    View
                                                </button>
                                            )}
                                        </td>


                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
               
            </div>
        </div>
    );
}

export default Customer;