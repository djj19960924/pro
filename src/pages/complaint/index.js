import { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class complaint extends PureComponent {
  render() {
    return <PageHeaderWrapper>{this.props.children}</PageHeaderWrapper>;
  }
}
export default complaint;
