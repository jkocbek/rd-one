export class UserResponseDto {
  @ApiProperty({ description: 'Id of the user' })
  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;

  @ApiProperty({ description: 'Name of the user' })
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @ApiProperty({ description: 'Creation time of the user' })
  @IsString()
  @IsNotEmpty()
  readonly createdAt!: string;

  static fromDomain(user: any): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
