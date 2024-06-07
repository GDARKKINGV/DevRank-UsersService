import Developer from "../models/dev.model.js";

export const getGlobalRanking = async (req, res) => {
  const { page, limit, searchTerm } = req.query;

  const skips = limit * (page - 1);

  try {
    let query = Developer.find().sort({ points: -1 });

    if (searchTerm) {
      if (searchTerm.startsWith("@")) {
        query = query.find({
          userName: { $regex: searchTerm.substring(1), $options: "i" },
        });
      } else {
        query = query.find({
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { lastName: { $regex: searchTerm, $options: "i" } },
          ],
        });
      }
    }

    const totalDevs = await Developer.countDocuments(query);

    const ranking = await query.skip(skips).limit(limit);

    if (!ranking) return res.status(400).json({ message: "No users found" });

    const formatRanking = ranking.map((dev, index) => {
      return {
        userId: dev._id,
        position: index + 1,
        name: dev.name,
        lastName: dev.lastName,
        userName: dev.userName,
        profileImage: dev.profileImage.url,
        points: dev.points,
      };
    });

    res.json({ ranking: formatRanking, totalDevs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
