import { aws_dms as dms } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { S3SourceTarget } from './base';

export interface S3TargetEndpointSettings {
  /**
   * An optional parameter to set a folder name in the S3 bucket.
   *
   * If provided, tables are created in the path `*bucketFolder* / *schema_name* / *table_name* /` . If this parameter isn't specified, the path used is `*schema_name* / *table_name* /` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-bucketfolder
   */
  readonly bucketFolder?: string;
  /**
   * The delimiter used to separate columns in the .csv file for both source and target. The default is a comma.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-csvdelimiter
   */
  readonly csvDelimiter?: string;
  /**
   * An optional parameter that specifies how AWS DMS treats null values.
   *
   * While handling the null value, you can use this parameter to pass a user-defined string as null when writing to the target. For example, when target columns are not nullable, you can use this option to differentiate between the empty string value and the null value. So, if you set this parameter value to the empty string ("" or ''), AWS DMS treats the empty string as the null value instead of `NULL` .
   *
   * The default value is `NULL` . Valid values include any valid string.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-csvnullvalue
   */
  readonly csvNullValue?: string;
  /**
   * The delimiter used to separate rows in the .csv file for both source and target.
   *
   * The default is a carriage return ( `\n` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-csvrowdelimiter
   */
  readonly csvRowDelimiter?: string;
  /**
   * The format of the data that you want to use for output. You can choose one of the following:.
   *
   * - `csv` : This is a row-based file format with comma-separated values (.csv).
   * - `parquet` : Apache Parquet (.parquet) is a columnar storage file format that features efficient compression and provides faster query response.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-dataformat
   */
  readonly dataFormat?: string;

}

export interface S3TargetProps {
  bucketArn: string;
  s3TargetEndpointSettings?: S3TargetEndpointSettings;
}

export class S3Target extends S3SourceTarget {

  endpoint: dms.CfnEndpoint;

  constructor(scope: Construct, id: string, props: S3TargetProps) {
    super(scope, id);

    const accessRole = this.createS3AccessRole(props.bucketArn);

    this.endpoint = new dms.CfnEndpoint(this, 'S3SourceEndpoint', {
      endpointType: 'target',
      engineName: 's3',
      s3Settings: {
        ...props.s3TargetEndpointSettings,
        bucketName: s3.Bucket.fromBucketArn(this, 'Bucket', props.bucketArn).bucketName,
        serviceAccessRoleArn: accessRole.roleArn,
      },
    });
  }
}

export interface RdsTargetProps {
  engine: string;
}

export class RdsTarget extends Construct {


  constructor(scope: Construct, id: string, props: RdsTargetProps) {
    super(scope, id);

    if (props.engine == 'postgres') {
      console.log('postgres');
      // const settings: dms.CfnDataProvider.PostgreSqlSettingsProperty = {
      //     password: 'password',
      //     port: 5432,
      //     serverName: 'serverName',
      //     username: 'username'
      // };
    }
  }
}