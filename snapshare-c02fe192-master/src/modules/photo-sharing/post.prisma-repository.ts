@Injectable()
export class PostPrismaRepository implements PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPostById(id: string): Promise<IPost | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });
    return post ? this.toDomain(post) : null;
  }

  private toDomain(post: Post): IPost {
    return {
      id: post.id,
      userId: post.userId,
      caption: post.caption,
      photoUrl: post.photoUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      deletedAt: post.deletedAt,
    };
  }
}