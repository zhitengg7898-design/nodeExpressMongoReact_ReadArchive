import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const mockBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    type: "book",
    description:
      "A novel about the American dream set in the Jazz Age, following the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg",
    links: [
      {
        label: "Free PDF (Project Gutenberg)",
        url: "https://www.gutenberg.org/ebooks/64317",
      },
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0743273567",
      },
    ],
  },
  {
    title: "Attention Is All You Need",
    author: "Vaswani et al.",
    type: "article",
    description:
      "The seminal paper introducing the Transformer architecture, which became the foundation of modern large language models like GPT and BERT.",
    coverImage: "",
    links: [
      {
        label: "Free PDF (arXiv)",
        url: "https://arxiv.org/pdf/1706.03762",
      },
      { label: "arXiv Page", url: "https://arxiv.org/abs/1706.03762" },
    ],
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    type: "book",
    description:
      "A handbook of agile software craftsmanship. Covers writing readable, maintainable code with practical examples in Java.",
    coverImage: "https://m.media-amazon.com/images/I/41xShlnTZTL.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0132350882",
      },
      {
        label: "Buy on O'Reilly",
        url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
      },
    ],
  },
  {
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    type: "book",
    description:
      "The definitive textbook on deep learning, covering neural networks, optimization, convolutional nets, RNNs, and more.",
    coverImage: "https://m.media-amazon.com/images/I/61fim5QqaqL.jpg",
    links: [
      {
        label: "Free Online Version",
        url: "https://www.deeplearningbook.org/",
      },
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0262035618",
      },
    ],
  },
  {
    title: "1984",
    author: "George Orwell",
    type: "book",
    description:
      "A dystopian novel set in a totalitarian society ruled by Big Brother, exploring surveillance, propaganda, and the destruction of individual thought.",
    coverImage: "https://m.media-amazon.com/images/I/71rpa1-kyvL.jpg",
    links: [
      {
        label: "Free PDF (Project Gutenberg Australia)",
        url: "https://gutenberg.net.au/ebooks01/0100021.txt",
      },
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0451524934",
      },
    ],
  },
  {
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    type: "book",
    description:
      "Part of the YDKJS series. A deep dive into how JavaScript handles scope, hoisting, closures, and the module pattern.",
    coverImage: "https://m.media-amazon.com/images/I/7186YfjgHHL.jpg",
    links: [
      {
        label: "Free on GitHub",
        url: "https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md",
      },
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/1491904194",
      },
    ],
  },
  {
    title: "A Survey of Large Language Models",
    author: "Zhao et al.",
    type: "article",
    description:
      "A comprehensive survey covering the evolution of LLMs, pre-training, fine-tuning, alignment, and evaluation benchmarks.",
    coverImage: "",
    links: [
      {
        label: "Free PDF (arXiv)",
        url: "https://arxiv.org/pdf/2303.18223",
      },
      { label: "arXiv Page", url: "https://arxiv.org/abs/2303.18223" },
    ],
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    type: "book",
    description:
      "Timeless advice for software developers covering topics from personal responsibility and career development to coding techniques.",
    coverImage: "https://m.media-amazon.com/images/I/71f743sOq6L.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0135957052",
      },
      {
        label: "Official Site",
        url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
      },
    ],
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    type: "book",
    description:
      "Set in the American South during the 1930s, this Pulitzer Prize-winning novel explores racial injustice and moral growth through the eyes of young Scout Finch.",
    coverImage: "https://m.media-amazon.com/images/I/71FxgtFKcQL.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0061935026",
      },
    ],
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    type: "book",
    description:
      "A witty romantic novel following Elizabeth Bennet as she navigates issues of manners, upbringing, morality, and marriage in early 19th-century England.",
    coverImage: "https://m.media-amazon.com/images/I/71Q1tPupKjL.jpg",
    links: [
      {
        label: "Free PDF (Project Gutenberg)",
        url: "https://www.gutenberg.org/ebooks/1342",
      },
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0141439513",
      },
    ],
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    type: "book",
    description:
      "A dystopian novel set in a futuristic World State where citizens are engineered and conditioned for happiness, raising questions about freedom and humanity.",
    coverImage: "https://m.media-amazon.com/images/I/81zE42gT3xL.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0060850523",
      },
    ],
  },
  {
    title: "The Catcher in the Rye",
    author: "J. D. Salinger",
    type: "book",
    description:
      "Holden Caulfield recounts the days following his expulsion from prep school, capturing teenage alienation and the painful loss of innocence.",
    coverImage: "https://m.media-amazon.com/images/I/8125BDk3l9L.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0316769177",
      },
    ],
  },
  {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    type: "book",
    description:
      "A psychological novel following Raskolnikov, a student in St. Petersburg who murders a pawnbroker and struggles with guilt and redemption.",
    coverImage: "https://m.media-amazon.com/images/I/71FMnFEBnAL.jpg",
    links: [
      {
        label: "Free PDF (Project Gutenberg)",
        url: "https://www.gutenberg.org/ebooks/2554",
      },
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0486415872",
      },
    ],
  },
  {
    title: "Introduction to Algorithms",
    author: "Cormen, Leiserson, Rivest, Stein",
    type: "book",
    description:
      "Known as CLRS, this is the standard reference for algorithms and data structures used in university courses worldwide.",
    coverImage: "https://m.media-amazon.com/images/I/61Pgdn8Ys-L.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/026204630X",
      },
      {
        label: "MIT OpenCourseWare",
        url: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/",
      },
    ],
  },
  {
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    type: "book",
    description:
      "A comprehensive textbook covering the full network stack from physical layer to application layer, with real-world protocol examples.",
    coverImage: "https://m.media-amazon.com/images/I/71lrPEWBqlL.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0132126958",
      },
    ],
  },
  {
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Gang of Four",
    type: "book",
    description:
      "The classic catalog of 23 software design patterns by the Gang of Four. Essential reading for understanding reusable object-oriented design.",
    coverImage: "https://m.media-amazon.com/images/I/51szD9HC9pL.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0201633612",
      },
    ],
  },
  {
    title: "The Linux Command Line",
    author: "William Shotts",
    type: "book",
    description:
      "A complete introduction to using the Linux command line, covering everything from basic navigation to shell scripting.",
    coverImage: "https://m.media-amazon.com/images/I/71MYHXEIyFL.jpg",
    links: [
      {
        label: "Free Online Version",
        url: "https://linuxcommand.org/tlcl.php",
      },
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/1593279523",
      },
    ],
  },
  {
    title: "Operating System Concepts",
    author: "Abraham Silberschatz, Peter Galvin, Greg Gagne",
    type: "book",
    description:
      "Known as the 'Dinosaur Book', this is the standard OS textbook covering processes, threads, memory management, file systems, and more.",
    coverImage: "https://m.media-amazon.com/images/I/71bTqSGMssL.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/1119800366",
      },
    ],
  },
  {
    title: "MapReduce: Simplified Data Processing on Large Clusters",
    author: "Jeffrey Dean, Sanjay Ghemawat",
    type: "article",
    description:
      "Google's landmark paper introducing the MapReduce programming model for processing and generating large datasets on commodity hardware.",
    coverImage: "",
    links: [
      {
        label: "Free PDF",
        url: "https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf",
      },
    ],
  },
  {
    title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
    author: "Satoshi Nakamoto",
    type: "article",
    description:
      "The original Bitcoin whitepaper proposing a decentralized electronic cash system using a proof-of-work blockchain.",
    coverImage: "",
    links: [{ label: "Free PDF", url: "https://bitcoin.org/bitcoin.pdf" }],
  },
  {
    title: "ImageNet Classification with Deep Convolutional Neural Networks",
    author: "Krizhevsky, Sutskever, Hinton",
    type: "article",
    description:
      "The AlexNet paper that sparked the deep learning revolution in computer vision by winning ImageNet 2012 by a large margin.",
    coverImage: "",
    links: [
      {
        label: "Free PDF",
        url: "https://proceedings.neurips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf",
      },
    ],
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    type: "book",
    description:
      "A practical guide to building good habits and breaking bad ones through small, incremental changes that compound over time.",
    coverImage: "https://m.media-amazon.com/images/I/81wgcld4wxL.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0735211299",
      },
      {
        label: "Official Site",
        url: "https://jamesclear.com/atomic-habits",
      },
    ],
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    type: "book",
    description:
      "Argues that the ability to focus without distraction on cognitively demanding tasks is becoming rare and valuable in the modern economy.",
    coverImage: "https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/1455586692",
      },
    ],
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    type: "book",
    description:
      "Nobel laureate Kahneman explores the two systems of thought — fast intuitive thinking and slow deliberate reasoning — and how they shape our decisions.",
    coverImage: "https://m.media-amazon.com/images/I/71wvKXWoMqL.jpg",
    links: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/0374533555",
      },
    ],
  },
];

const seed = async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();
  console.log("MongoDB connected");

  let seeder = await db
    .collection("users")
    .findOne({ email: "seed@readarchive.com" });
  if (!seeder) {
    const hashed = await bcrypt.hash("Seed1234!", 12);
    const now = new Date();
    const { insertedId } = await db.collection("users").insertOne({
      username: "readarchive_seed",
      email: "seed@readarchive.com",
      password: hashed,
      favorites: [],
      collections: [],
      createdAt: now,
      updatedAt: now,
    });
    seeder = { _id: insertedId };
    console.log("Seed user created");
  }

  await db.collection("books").deleteMany({});
  console.log("Existing books cleared");

  const now = new Date();
  const books = mockBooks.map((b) => ({
    ...b,
    submittedBy: seeder._id,
    createdAt: now,
    updatedAt: now,
  }));
  await db.collection("books").insertMany(books);
  await db
    .collection("books")
    .createIndex({ title: "text", author: "text", description: "text" });
  console.log(`${books.length} books inserted`);

  await client.close();
  console.log("Done");
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
