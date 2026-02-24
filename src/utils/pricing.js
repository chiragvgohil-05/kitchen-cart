export const calculateDiscountPercentage = (mrp, sellingPrice) => {
    const parsedMrp = Number(mrp);
    const parsedSellingPrice = Number(sellingPrice);

    if (!Number.isFinite(parsedMrp) || parsedMrp <= 0 || !Number.isFinite(parsedSellingPrice) || parsedSellingPrice < 0) {
        return 0;
    }

    const discount = ((parsedMrp - parsedSellingPrice) / parsedMrp) * 100;
    return Math.max(0, Math.round(discount));
};
