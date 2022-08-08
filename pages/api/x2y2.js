import axios from 'axios'

export default async function handler(req, res) {
  const query = req.query
  const { contractAddress } = query

  await axios
    .get(`https://api.x2y2.org/v1/contracts/${contractAddress}/stats`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.X2Y2_API_KEY,
      },
    })
    .then(({ data }) => {
      res.status(200).json(data.data.floor_price)
    })
    .catch((error) => {
      res.status(400).json(error)
    })
}
