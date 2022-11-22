import { Injectable, ForbiddenException, Logger, ConsoleLogger } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map, catchError } from 'rxjs';

@Injectable()
export class CanvaseService {

  constructor(
    private http: HttpService,
  ) { }

  async getCanvasDataWith(route: string, params: string) {
    const access_token = process.env.CANVAS_TEST_ACCESSTOKEN || '1017~70Qq4HwOVtkUXuDrsj7mfm7U5ckOx9KUIoSY95plefeS9LQRZpkhRAIBlGvhP1vd';
    const url = `${process.env.CANVAS_API_BASE_URL || `https://utexas.instructure.com/api/v1`}/${route}/${params}`;
    Logger.log(url);
    return this.http
      .get(
        url,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      )
      .pipe(
        map((res) => res.data)
        // map((bpi) => bpi?.USD),
        // map((usd) => {
        //   return usd?.rate;
        // }),
      )
      .pipe(
        catchError((error) => {
          Logger.log(error);
          throw new ForbiddenException('API not available');
        }),
      );
  }
}
