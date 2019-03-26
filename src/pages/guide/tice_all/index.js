import { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class tice extends PureComponent {
  render() {
    return <PageHeaderWrapper>{this.props.children}</PageHeaderWrapper>;
  }
}
export default tice;
