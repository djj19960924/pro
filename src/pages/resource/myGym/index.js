import { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class resource extends PureComponent {
  render() {
    return <PageHeaderWrapper>{this.props.children}</PageHeaderWrapper>;
  }
}
export default resource;
