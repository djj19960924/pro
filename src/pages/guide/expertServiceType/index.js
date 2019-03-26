import { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class guide extends PureComponent {
  render() {
    return <PageHeaderWrapper>{this.props.children}</PageHeaderWrapper>;
  }
}
export default guide;
