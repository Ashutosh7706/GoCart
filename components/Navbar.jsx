'use client'

import {
    Search,
    ShoppingCart,
    ChevronDown,
    LogOut,
    User,
    Store,
    Heart,
    Menu,
    X, Bell
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {

    const router = useRouter();

    const [search, setSearch] = useState("");

    const [user, setUser] = useState(null);

    const [loadingUser, setLoadingUser] = useState(true);

    const [profileOpen, setProfileOpen] = useState(false);

    const [mobileMenu, setMobileMenu] = useState(false); 

    const [notifications, setNotifications] = useState([]);

    const [showNotifications, setShowNotifications] = useState(false);

    const notificationRef = useRef(null);

    const profileRef = useRef(null);

    const cartCount = useSelector(state => state.cart.total);

    const wishlistTotal = useSelector(
        state => state.wishlist.total
    );

    useEffect(() => {

        fetchCurrentUser();

    }, []);

    async function fetchCurrentUser() {

        try {

            const res = await fetch("/api/auth/me", {
                credentials: "include",
            });

            const data = await res.json();

            setUser(data.user);

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingUser(false);

        }

    }

    async function logout() {

        try {

            await fetch("/api/auth/logout", {

                method: "POST",

                credentials: "include",

            });

            setUser(null);

            router.push("/login");

            router.refresh();

        } catch (error) {

            console.error(error);

        }

    }

    function handleSearch(e) {

        e.preventDefault();

        if (!search.trim()) return;

        router.push(`/shop?search=${search}`);

    }

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {

                setProfileOpen(false);

            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

useEffect(() => {

    loadNotifications();

}, []);

async function loadNotifications() {

    try {

        const res = await fetch("/api/notifications", {

            credentials: "include",

        });

        if (!res.ok) return;

        const data = await res.json();

        setNotifications(data);

    }

    catch (error) {

        console.log(error);

    }

}

useEffect(() => {

    function handleClick(event) {

        if (

            notificationRef.current &&

            !notificationRef.current.contains(event.target)

        ) {

            setShowNotifications(false);

        }

    }

    document.addEventListener("mousedown", handleClick);

    return () =>

        document.removeEventListener(

            "mousedown",

            handleClick

        );

}, []);

const unreadCount = notifications.filter(

    notification => !notification.isRead

).length;

    return (

        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">

            <div className="max-w-7xl mx-auto px-6">

                <div className="h-20 flex items-center justify-between">

                    {/* Logo */}

                    <Link
                        href="/"
                        className="relative text-4xl font-bold text-slate-800"
                    >

                        <span className="text-green-600">go</span>

                        cart

                        <span className="text-green-600">.</span>


                        <span className="absolute -top-2 -right-10 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full">

                            PLUS

                        </span>

                    </Link>

                    {/* Desktop Menu */}

                    <div className="hidden lg:flex items-center gap-8">

                        <Link href="/">Home</Link>

                        <Link href="/shop">Shop</Link>

                        <Link href="/">About</Link>

                        <Link href="/">Contact</Link>

                    </div>

                    {/* Search */}

                    <form
                        onSubmit={handleSearch}
                        className="hidden xl:flex items-center bg-slate-100 rounded-full px-4 py-3 w-80"
                    >

                        <Search
                            size={18}
                            className="text-slate-500"
                        />

                        <input

                            value={search}

                            onChange={(e) =>
                                setSearch(e.target.value)
                            }

                            className="bg-transparent ml-3 outline-none w-full"

                            placeholder="Search products"

                        />

                    </form>

                    {/* Right */}

                    <div className="flex items-center gap-6">

                        {/* Wishlist */}

                        <Link
                            href="/wishlist"
                            className="relative"
                        >

                            <Heart
                                size={24}
                                className="text-slate-700"
                            />

                            {wishlistTotal > 0 && (

                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">

                                    {wishlistTotal}

                                </span>

                            )}

                        </Link>

                        {/* Cart */}

                        <Link
                            href="/cart"
                            className="relative"
                        >

                            <ShoppingCart
                                size={24}
                                className="text-slate-700"
                            />

                            {cartCount > 0 && (

                                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">

                                    {cartCount}

                                </span>

                            )}

                        </Link>

                        <div
    className="relative"
    ref={notificationRef}
>

    <button

        onClick={() =>

            setShowNotifications(

                !showNotifications

            )

        }

        className="relative p-2 rounded-full hover:bg-slate-100 transition"

    >

        <Bell size={24} />

        {

            unreadCount > 0 && (

                <span

                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"

                >

                    {unreadCount}

                </span>

            )

        }

    </button>

    {

        showNotifications && (

            <div

                className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50"

            >

                <div className="px-5 py-4 border-b bg-slate-50">

                    <h2 className="font-semibold text-lg">

                        Notifications

                    </h2>

                </div>

                {

                    notifications.length === 0 ? (

                        <div className="p-6 text-center text-slate-500">

                            No Notifications

                        </div>

                    ) : (

                        <>

                            {

                                notifications

                                    .slice(0, 5)

                                    .map(notification => (

                                        <a

                                            key={notification.id}

                                            href={

                                                notification.link ||

                                                "/notifications"

                                            }

                                            className={`block px-5 py-4 border-b hover:bg-slate-50 transition

                                            ${

                                                !notification.isRead

                                                    ? "bg-green-50"

                                                    : ""

                                            }`}

                                        >

                                            <h3 className="font-medium">

                                                {notification.title}

                                            </h3>

                                            <p className="text-sm text-slate-500 mt-1">

                                                {notification.message}

                                            </p>

                                            <p className="text-xs text-slate-400 mt-2">

                                                {

                                                    new Date(

                                                        notification.createdAt

                                                    ).toLocaleString()

                                                }

                                            </p>

                                        </a>

                                    ))

                            }

                            <a

                                href="/notifications"

                                className="block text-center py-3 font-medium text-green-600 hover:bg-green-50"

                            >

                                View All →

                            </a>

                        </>

                    )

                }

            </div>

        )

    }

</div>

                        {/* User */}

                        {!loadingUser && !user ? (

                            <div className="hidden sm:flex gap-3">

                                <Link
                                    href="/login"
                                    className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                >

                                    Login

                                </Link>

                                <Link
                                    href="/register"
                                    className="px-5 py-2 rounded-lg border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                >

                                    Register

                                </Link>

                            </div>

                        ) : (

                            <div
                                ref={profileRef}
                                className="relative"
                            >

                                <button

                                    onClick={() =>
                                        setProfileOpen(!profileOpen)
                                    }

                                    className="flex items-center gap-2"

                                >

                                    <User size={22} />

                                    <span className="hidden md:block">

                                        {user?.name}

                                    </span>

                                    <ChevronDown size={18} />

                                </button>

                                {profileOpen && (

                                    <div className="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-xl border overflow-hidden">

                                        <Link
                                            href="/orders"
                                            className="flex items-center gap-3 px-5 py-3 hover:bg-slate-100"
                                        >

                                            <User size={18} />

                                            My Orders

                                        </Link>

                                        <Link
                                            href="/wishlist"
                                            className="flex justify-between items-center px-5 py-3 hover:bg-slate-100"
                                        >

                                            <div className="flex items-center gap-3">

                                                <Heart
                                                    size={18}
                                                    className="text-red-500"
                                                />

                                                Wishlist

                                            </div>

                                            {wishlistTotal > 0 && (

                                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">

                                                    {wishlistTotal}

                                                </span>

                                            )}

                                        </Link>

                                        {user?.role === "SELLER" && (

                                            <Link
                                                href="/store"
                                                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-100"
                                            >

                                                <Store size={18} />

                                                Store Dashboard

                                            </Link>

                                        )}

                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50"
                                        >

                                            <LogOut size={18} />

                                            Logout

                                        </button>

                                    </div>

                                )}

                            </div>

                        )}

                        {/* Mobile Menu */}

                        <button
                            onClick={() =>
                                setMobileMenu(!mobileMenu)
                            }
                            className="lg:hidden"
                        >

                            {mobileMenu ? (
                                <X />
                            ) : (
                                <Menu />
                            )}

                        </button>

                    </div>

                </div>

                {/* Mobile Navigation */}

                {mobileMenu && (

                    <div className="lg:hidden py-4 border-t flex flex-col gap-4">

                        <Link href="/">Home</Link>

                        <Link href="/shop">Shop</Link>

                        <Link href="/wishlist">

                            Wishlist

                        </Link>

                        <Link href="/cart">

                            Cart

                        </Link>

                        <Link href="/orders">

                            Orders

                        </Link>

                    </div>

                )}

            </div>

        </nav>

    );

};

export default Navbar;