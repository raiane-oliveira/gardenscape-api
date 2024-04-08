export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public equals(vo: ValueObject<unknown>) {
    if (!vo) {
      return false
    }

    if (!vo.props) {
      return false
    }

    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
