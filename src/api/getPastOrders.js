export default async function getPastOders(page) {
  const response = await fetch(`/api/past-orders?page=${page}`);
}
