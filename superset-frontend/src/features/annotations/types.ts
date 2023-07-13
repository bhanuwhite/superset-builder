/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
type user = {
  id: number;
  first_name: string;
  last_name: string;
};

export type AnnotationObject = {
  changed_by?: user;
  changed_on_delta_humanized?: string;
  created_by?: user;
  end_dttm: string;
  id?: number;
  json_metadata?: string;
  long_descr?: string;
  short_descr: string;
  start_dttm: string;
  layer?: {
    id: number;
  };
};
