const publicUrl = process.env.PUBLIC_URL;
// console.log(process.env.PUBLIC_URL)

const carouselImgs = [
    {
        url: `${publicUrl}/image/home/flower-de-luce.jpg`,
        title: 'Flower-de-luce',
    },
    {
        url: `${publicUrl}/image/home/columbria.jpg`,
        title: 'Columbria',
    },
    {
        url: `${publicUrl}/image/home/new-amsterdam.jpg`,
        title: 'New Amsterdam',
    },
];

export {
    carouselImgs,
};