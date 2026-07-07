export async function loadWishlist(dispatch, setWishlist) {

    try {

        const res = await fetch("/api/wishlist", {
            credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        dispatch(setWishlist(data));

    } catch (error) {

        console.error(error);

    }

}